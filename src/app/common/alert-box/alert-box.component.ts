import { Component, Input } from '@angular/core';

@Component({
  selector: 'alert-box', 
  templateUrl: './alert-box.component.html',
  styleUrl: './alert-box.component.scss'
})
export class AlertBoxComponent {
  // Inputs to receive data from parent components
  @Input() title!: string;
  @Input() buttonTitle!: string;

  showModal: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }
}
