import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MessageService } from '../../../services/message.service';
import { Message } from '../../../models/message.model';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatExpansionModule
  ],
  template: `
    <div class="header">
      <h1>Messages</h1>
    </div>

    <div *ngIf="loading" class="loading-spinner">
      <mat-spinner></mat-spinner>
    </div>

    <div *ngIf="!loading && messages.length === 0" class="no-data">
      <mat-card>
        <mat-card-content>
          <p>No messages found.</p>
        </mat-card-content>
      </mat-card>
    </div>

    <mat-accordion *ngIf="!loading && messages.length > 0">
      <mat-expansion-panel *ngFor="let message of messages">
        <mat-expansion-panel-header>
          <mat-panel-title>
            {{ message.senderName }}
          </mat-panel-title>
          <mat-panel-description>
            {{ message.email }}
          </mat-panel-description>
        </mat-expansion-panel-header>
        
        <div class="message-content">
          <p><strong>From:</strong> {{ message.senderName }}</p>
          <p><strong>Email:</strong> {{ message.email }}</p>
          <p><strong>Message:</strong></p>
          <div class="message-text">{{ message.content }}</div>
        </div>
      </mat-expansion-panel>
    </mat-accordion>
  `,
  styles: [`
    .header {
      margin-bottom: 20px;
    }
    
    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 40px;
    }
    
    .no-data {
      text-align: center;
      padding: 40px;
      color: #666;
    }
    
    .message-content {
      padding: 16px 0;
    }
    
    .message-text {
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 4px;
      margin-top: 8px;
      white-space: pre-wrap;
    }
    
    mat-expansion-panel {
      margin-bottom: 8px;
    }
  `]
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [];
  loading = false;

  constructor(
    private messageService: MessageService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.loading = true;
    this.messageService.getAllMessages().subscribe({
      next: (messages: Message[]) => {
        this.messages = messages;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading messages:', error);
        this.snackBar.open('Error loading messages', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}