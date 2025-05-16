// UI Enhancer for Book Management System

document.addEventListener('DOMContentLoaded', function() {
  // Initial enhancement
  setTimeout(enhanceUI, 300);
  
  // Enhance UI when Vue updates the DOM
  const observer = new MutationObserver(function(mutations) {
    enhanceUI();
  });
  
  // Start observing the app container
  const appContainer = document.getElementById('app');
  if (appContainer) {
    observer.observe(appContainer, { 
      childList: true, 
      subtree: true 
    });
  }
});

function enhanceUI() {
  // Remove text from edit and delete buttons
  document.querySelectorAll('.edit-btn, .delete-btn').forEach(btn => {
    // Keep only the icon
    const icon = btn.querySelector('i');
    if (icon && btn.textContent.trim() !== '') {
      btn.innerHTML = '';
      btn.appendChild(icon);
    }
    
    // Add title attribute for accessibility
    if (btn.classList.contains('edit-btn') && !btn.hasAttribute('title')) {
      btn.setAttribute('title', 'Edit');
    } else if (btn.classList.contains('delete-btn') && !btn.hasAttribute('title')) {
      btn.setAttribute('title', 'Delete');
    }
  });
  
  // Convert regular links to fancy link buttons
  document.querySelectorAll('.book p:has(a.book-link), .book p a.book-link').forEach(element => {
    const linkPara = element.tagName === 'P' ? element : element.closest('p');
    const link = linkPara.tagName === 'P' ? linkPara.querySelector('a.book-link') : element;
    if (!link) return;
    
    const bookCard = linkPara.closest('.book');
    if (!bookCard) return;
    
    // Check if we already processed this link
    if (bookCard.querySelector('.book-link-container')) return;
    
    // Create link container
    const linkContainer = document.createElement('div');
    linkContainer.className = 'book-link-container';
    
    // Create link button
    const linkBtn = document.createElement('a');
    linkBtn.href = link.href;
    linkBtn.target = '_blank';
    linkBtn.className = 'link-btn';
    linkBtn.title = 'Visit Link';
    
    // Create icon
    const icon = document.createElement('i');
    icon.className = 'fas fa-external-link-alt';
    
    // Assemble elements
    linkBtn.appendChild(icon);
    linkContainer.appendChild(linkBtn);
    bookCard.appendChild(linkContainer);
    
    // Hide the original link paragraph
    linkPara.style.display = 'none';
  });
}