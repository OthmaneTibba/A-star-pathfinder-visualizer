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
      'https://java-a-start-pathfinder-production.up.railway.app/api/pathfinder/find',
      {
        nodes: nodes,
      }
    );
  }
}
