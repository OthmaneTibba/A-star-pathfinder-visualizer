import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Node } from '../models/node';

@Injectable({
  providedIn: 'root',
})
export class PathService {
  constructor(private client: HttpClient) {}

  getPath(nodes: Node[]) {
    return this.client.post<Node[]>(
      'http://localhost:8080/api/pathfinder/find',
      {
        nodes: nodes,
      }
    );
  }
}
