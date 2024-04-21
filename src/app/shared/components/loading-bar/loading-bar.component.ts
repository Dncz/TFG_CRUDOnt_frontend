import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-loading-bar',
  templateUrl: './loading-bar.component.html',
  styles: ``
})
export class LoadingBarComponent {
  @Input() loading: boolean = false;
}
