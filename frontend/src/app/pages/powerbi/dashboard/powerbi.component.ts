import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-powerbi',
  templateUrl: './powerbi.component.html',
  styleUrls: ['./powerbi.component.scss']
})
export class PowerbiComponent {
  embedUrl: SafeResourceUrl;

  private rawUrl = 'https://app.powerbi.com/view?r=eyJrIjoiYTExMzY3MjQtMGMyZC00MjUwLWJiYmMtZDI2Nzk1MzFmOTQ3IiwidCI6IjVmNTNiNGNlLTYzZDQtNGVlOC04OGQyLTIyZjBiMmQ0YjI3YSIsImMiOjR9'; // <- TU URL REAL

  constructor(private sanitizer: DomSanitizer) {
    this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawUrl);
  }
}
