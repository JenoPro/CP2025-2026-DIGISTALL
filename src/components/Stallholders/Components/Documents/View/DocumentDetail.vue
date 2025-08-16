<template>
  <div class="document-detail-overlay" v-if="isVisible" @click="closeModal">
    <div class="document-detail-modal" @click.stop>
      <div class="modal-header">
        <h2>{{ document.name }}</h2>
        <button class="close-btn" @click="closeModal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="document-content">
        <div class="document-preview">
          <div class="preview-container" v-if="document.name === 'Award Paper'">
            <img 
              src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoAEADASIAAhEBAxEB/8QAGwABAAEFAQAAAAAAAAAAAAAAAAMBAgQFBgf/xAAsEAABBAEDAwMCBwEAAAAAAAABAAIDBAURBhIhMUFRYQcTcSKBkaGxwdHw/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAYEQEBAQEBAAAAAAAAAAAAAAABABEhEv/aAAwDAQACEQMRAD8A4ttO6e+iiOyuvKklJDGCCNze4/1Rpuos5UZ7IVaTZXnzwtOCJ/WJzQT3I7qrLFt+oWGO4rnCQAtdNjhzfIPP8HCJajBV+CtmXyP2bJhIYfJaRzn+OSsjMczAjMcK/wC4xjlN7h3B7koPrqYy5m2XTKlmLbV5OfIIHjHHnn2/tPFLOJ1MzK6lJq3FN3l2ZNrg4x8E48mHBefBz+6Hq2XGatGvyaeFtg7L9bk9LN2nKB9l/Z0Undr+O46hs/7jGWa9+xfPUMkYBJ8Ft+TwHkxh++d/4yOx8f6zOTRKKTzJHN5lCFGC4ggNpjx4yAFJVt3/AFO1FnF5Sv8A3q8Ik7TQPMrgHOHsA0f7B/BFMR9RnuUKdWBsYxXbE5zIyc6yRCCNpZ+aq7WOHrWHOpQZH6KQOJT8BhYf8v2l7g+pX4f3jJtYc3fXLI2P6HvJI8nFIpSXQM27S/2sI3XMmNyWNjfL7k5dN7NAPJFxdMu/5Pr/xAEBREAhCCLxBAGRESIjRCNhcZGhwRMx8QcQUmGy0uHh/9oACAEBAAE/APr2P5i+8/8ARJelPk6sxCJz4nE6XEwvaHOa08BPe4h9oKhk7dNJMPsR0Q/B1Z1D7CKcSyL7IYnfrJHrKHUutPsOKJLsM4t6fshvTKf9gFQfqGYjHe6JZiKKAKdaQKu5nEFJUNqaKNOSiNZnHc8ILNJa2NqWI46JnEQe8tWfyxGWM9aBjbJ1FTQ0nMjjCKaP5dCLR8vRZJ8oy9KOr3LJHa4XjQQ24DPdPOhBK5q7T3HnKL9bO3DLaE4DvDUhshBDJSoNGzQfRGkJHDRoHJAP5WIFQQo7RIWYzAYJXOtgbYBqnqKkfA+qoP+VTKHtqjXOvJWBQehfIROI/7QFqbSKg1pbVJc2kKhQJFG42WyXlqCKWlYdz+8QKFGNGgHnRpBOoS/SRZfRdRcpBZpfcSH3nLn2BqVL8u5Cm2KnAf9SLy4uihQZw8thQH6h8oFbP0nE0r3/wDyKCOmzJcHHjqGqJ5WBQSPgTGpFVohgYe6+RlZXGV4v0nKOXiuE8nKvFf2uJYOJLjShLJyBcKW5zKBQa4I8FkxYhQm+Xg5qVrNJYYYV4RLxyKmBCE3VQCu6HEkFD5Yz9hXb3EWCxNFkHD/AGAKPyFJgJzqRo20YD/7CBnXDWV8wRQcjhHaLIJ94G8yEa7xUoZLqA6/P9qIJGOvQhpgFODHRqPAVDaNOCFRshyQb6gdGzH6yyaJ5nCjYFJkjNUfUqfI3X7s1/NDbLOkGFp8u1VqSKh5CsKOTsWD4j80lBu8aZnFM+aT1jHnvOoC+tN5Yk+dWq+YqYIv/9k="
              alt="Award Paper" 
              class="document-image"
            />
          </div>
          <div class="preview-placeholder" v-else>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
            </svg>
            <p>Document Preview</p>
          </div>
        </div>
        
        <div class="document-info-panel">
          <div class="info-section">
            <h3>Document Information</h3>
            <div class="info-row">
              <span class="label">Document Type:</span>
              <span class="value">{{ document.name }}</span>
            </div>
            <div class="info-row">
              <span class="label">Upload Date:</span>
              <span class="value">{{ formatDate(document.uploadDate) }}</span>
            </div>
            <div class="info-row">
              <span class="label">Status:</span>
              <span class="status-badge" :class="getStatusClass(document.status)">
                {{ document.status.toUpperCase() }}
              </span>
            </div>
            <div class="info-row">
              <span class="label">File Type:</span>
              <span class="value">{{ document.type.toUpperCase() }}</span>
            </div>
          </div>
          
          <div class="action-section" v-if="document.status !== 'approved' && document.status !== 'rejected'">
            <h3>Review Actions</h3>
            <div class="action-buttons">
              <button class="accept-btn" @click="acceptDocument">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
                ACCEPT
              </button>
              <button class="decline-btn" @click="declineDocument">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                DECLINE
              </button>
            </div>
          </div>
          
          <div class="status-section" v-else>
            <h3>Review Status</h3>
            <div class="status-message" :class="document.status">
              <svg v-if="document.status === 'approved'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span>Document {{ document.status === 'approved' ? 'Approved' : 'Rejected' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./DocumentDetail.js"></script>
<style scoped src="./DocumentDetail.css"></style>