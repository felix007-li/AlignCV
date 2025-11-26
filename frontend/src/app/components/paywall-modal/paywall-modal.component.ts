import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingService } from '../../services/billing.service';

@Component({
  standalone: true,
  selector: 'aligncv-paywall-modal',
  imports: [CommonModule],
  templateUrl: './paywall-modal.component.html',
  styleUrls: ['./paywall-modal.component.scss']
})
export class PaywallModalComponent {
  @Output() close = new EventEmitter<void>();
  constructor(private billing: BillingService){}
  buyPass(){ this.billing.checkout({ plan: 'pass_14d' }); }
  subscribe(){ this.billing.checkout({ plan: 'monthly' }); }
}
