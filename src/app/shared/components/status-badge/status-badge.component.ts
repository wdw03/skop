import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="badge" [ngClass]="statusClass">{{ status }}</span>`,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;
      letter-spacing: 0.3px;
    }
    .active { background: #e8f5e9; color: #2e7d32; }
    .inactive { background: #fafafa; color: #757575; }
    .onleave { background: #fff3e0; color: #e65100; }
    .terminated { background: #ffebee; color: #c62828; }
    .fulltime { background: #e3f2fd; color: #1565c0; }
    .parttime { background: #f3e5f5; color: #7b1fa2; }
    .contract { background: #fff8e1; color: #f57f17; }
    .intern { background: #e0f7fa; color: #00838f; }
    .default { background: #f5f5f5; color: #616161; }
  `]
})
export class StatusBadgeComponent {
  @Input() status = '';

  get statusClass(): string {
    const s = this.status.toLowerCase().replace(/\s/g, '');
    const validClasses = ['active', 'inactive', 'onleave', 'terminated', 'fulltime', 'parttime', 'contract', 'intern'];
    return validClasses.includes(s) ? s : 'default';
  }
}
