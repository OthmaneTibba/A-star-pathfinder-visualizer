import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Node } from '../../models/node';
import { ToastrService } from 'ngx-toastr';
import { PathService } from 'src/app/service/path.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  row: number = 20;
  col: number = 45;
  nodes: Node[] = [];
  gridStyle = 'gap-0 grid grid-cols-'.concat(this.col.toString());
  normalNodeStyle =
    'bg-gray-200 h-[30px] w-[30px] rounded border border-sky-500';
  obstacleNodeStyle =
    'bg-black h-[30px] w-[30px] rounded border border-gray-500';
  startNodeStyle =
    'bg-green-500 h-[30px] w-[30px] rounded border border-gray-500';
  targetNodeStyle =
    'bg-red-500 h-[30px] w-[30px] rounded border border-gray-500';
  pathNodeStyle =
    'bg-blue-500 h-[30px] w-[30px] rounded border border-gray-500';

  constructor(
    private toastService: ToastrService,
    private pathService: PathService
  ) {}

  choices = {
    start: false,
    target: false,
    obstacles: false,
  };

  ngOnInit(): void {
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        this.nodes.push({
          row: i,
          col: j,
          normal: true,
          target: false,
          obstacle: false,
          start: false,
          path: false,
        });
      }
    }
  }
  counter(count: number): number[] {
    return Array(count)
      .fill(0)
      .map((x, i) => i);
  }

  onClick(row: number, col: number) {
    let isChoiceSelected =
      this.choices.obstacles == true ||
      this.choices.start == true ||
      this.choices.target == true;

    if (!isChoiceSelected) {
      this.toastService.error('Error', 'Please select an option below', {
        timeOut: 2000,
      });
      return;
    }

    let found = this.nodes.find((node) => node.col == col && node.row == row);
    if (found) {
      if (this.choices.obstacles == true) {
        found.obstacle = true;
        found.normal = false;
      } else if (this.choices.start == true) {
        if (!this.checkIfStartExist()) {
          found.start = true;
          found.normal = false;
        } else {
          this.toastService.error('Error', 'start node already exist');
        }
      } else if (this.choices.target == true) {
        if (!this.checkIfTargetExist()) {
          found.target = true;
          found.normal = false;
        } else {
          this.toastService.error('Error', 'goal node already exist');
        }
      }
    }
  }

  getNodeByIndex(row: number, col: number) {
    return this.nodes.find((node) => node.col == col && node.row == row);
  }

  checkIfTargetExist(): boolean {
    let found = this.nodes.find((node) => node.target == true);

    if (found) {
      return true;
    }

    return false;
  }

  checkIfStartExist(): boolean {
    let found = this.nodes.find((node) => node.start == true);
    if (found) {
      return true;
    }
    return false;
  }

  selectOption(option: string) {
    if (option == 'start') {
      this.choices.start = true;
      this.choices.target = false;
      this.choices.obstacles = false;
    } else if (option == 'obstacle') {
      this.choices.start = false;
      this.choices.target = false;
      this.choices.obstacles = true;
    } else if (option == 'target') {
      this.choices.start = false;
      this.choices.target = true;
      this.choices.obstacles = false;
    }
  }

  reset() {
    this.nodes.forEach((node) => {
      node.normal = true;
      node.obstacle = false;
      node.target = false;
      node.path = false;
      node.start = false;
    });
    this.choices.obstacles = false;
    this.choices.start = false;
    this.choices.target = false;
  }

  isStartNodeExist() {
    const node = this.nodes.find((node) => node.start == true);
    if (node) {
      return true;
    }
    return false;
  }

  isGoalNodeExist() {
    const node = this.nodes.find((node) => node.target == true);
    if (node) {
      return true;
    }
    return false;
  }

  onSubmit() {
    if (!this.isStartNodeExist()) {
      this.toastService.error('you should have a start node', 'error', {
        timeOut: 500,
      });
      return;
    }

    if (!this.isGoalNodeExist()) {
      this.toastService.error('you should have a goal node', 'error', {
        timeOut: 500,
      });
      return;
    }

    this.pathService.getPath(this.nodes).subscribe({
      next: (data) => {
        console.log(data);
        for (let node of data) {
          for (let i = 0; i < this.nodes.length; i++) {
            if (
              this.nodes[i].col == node.col &&
              this.nodes[i].row == node.row
            ) {
              this.nodes[i] = node;
            }
          }
        }
      },
      error: (err) => {
        this.toastService.error('cannot find a path', 'error');
      },
    });
  }
}
