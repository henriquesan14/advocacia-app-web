import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-toggle-button',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './toggle-button.component.html',
  styleUrl: './toggle-button.component.css'
})
export class ToggleButtonComponent {
  @Input({required: true}) label: string = '';
  @Output() toggleEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() checked = false;

  changeToggle(){
    this.checked = !this.checked;
    this.toggleEvent.emit(this.checked);
  }
}
