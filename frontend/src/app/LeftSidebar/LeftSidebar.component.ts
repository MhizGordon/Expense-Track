import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-LeftSidebar',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './LeftSidebar.component.html',
  styleUrl: './LeftSidebar.component.scss'
})
export class LeftSidebarComponent {
}
