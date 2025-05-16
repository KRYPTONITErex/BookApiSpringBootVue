// Book UI enhancements

document.addEventListener('DOMContentLoaded', function() {
  // Wait for Vue to render
  setTimeout(enhanceUI, 500);
  
  // Also enhance when tab changes
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      setTimeout(enhanceUI, 500);
    });
  });
});

function enhanceUI() {
  // Make edit and delete buttons smaller and icon-only
  document.querySelectorAll('.edit-btn, .delete-btn').forEach(btn => {
    // Remove text nodes (keep only the icon)
    Array.from(btn.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        btn.removeChild(node);
      }
    });
    
    // Add title attribute if not present
    if (!btn.hasAttribute('title')) {
      if (btn.classList.contains('edit-btn')) {
        btn.setAttribute('title', 'Edit');
      } else if (btn.classList.contains('delete-btn')) {
        btn.setAttribute('title', 'Delete');
      }
    }
    
    // Apply styles
    btn.style.width = '32px';
    btn.style.height = '32px';
    btn.style.padding = '0';
    btn.style.borderRadius = '50%';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  });
  
  // Enhance book links
  document.querySelectorAll('.book p a.book-link').forEach(link => {
    const parentP = link.closest('p');
    if (!parentP) return;
    
    // Create link container
    const linkContainer = document.createElement('div');
    linkContainer.className = 'book-link-container';
    linkContainer.style.position = 'absolute';
    linkContainer.style.bottom = '10px';
    linkContainer.style.right = '10px';
    linkContainer.style.zIndex = '5';
    
    // Create link button
    const linkBtn = document.createElement('a');
    linkBtn.href = link.href;
    linkBtn.target = '_blank';
    linkBtn.className = 'link-btn';
    linkBtn.style.width = '28px';
    linkBtn.style.height = '28px';
    linkBtn.style.borderRadius = '50%';
    linkBtn.style.background = 'linear-gradient(135deg, #3a86ff, #4cc9f0)';
    linkBtn.style.color = 'white';
    linkBtn.style.display = 'flex';
    linkBtn.style.alignItems = 'center';
    linkBtn.style.justifyContent = 'center';
    linkBtn.style.position = 'relative';
    linkBtn.style.overflow = 'hidden';
    linkBtn.style.boxShadow = '0 2px 5px rgba(58, 134, 255, 0.3)';
    linkBtn.style.transition = 'all 0.3s ease';
    
    // Create icon
    const icon = document.createElement('i');
    icon.className = 'fas fa-external-link-alt';
    icon.style.fontSize = '12px';
    
    // Create tooltip
    const tooltip = document.createElement('span');
    tooltip.className = 'link-text';
    tooltip.textContent = 'Go to link';
    tooltip.style.position = 'absolute';
    tooltip.style.right = '32px';
    tooltip.style.background = 'linear-gradient(135deg, #3a86ff, #4cc9f0)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '15px';
    tooltip.style.fontSize = '12px';
    tooltip.style.opacity = '0';
    tooltip.style.transform = 'translateX(10px)';
    tooltip.style.transition = 'all 0.3s ease';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.pointerEvents = 'none';
    
    // Add hover effect
    linkBtn.addEventListener('mouseenter', () => {
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translateX(0)';
      linkBtn.style.transform = 'translateY(-2px) scale(1.1)';
      linkBtn.style.boxShadow = '0 5px 15px rgba(58, 134, 255, 0.5)';
    });
    
    linkBtn.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
      tooltip.style.transform = 'translateX(10px)';
      linkBtn.style.transform = '';
      linkBtn.style.boxShadow = '0 2px 5px rgba(58, 134, 255, 0.3)';
    });
    
    // Assemble elements
    linkBtn.appendChild(icon);
    linkBtn.appendChild(tooltip);
    linkContainer.appendChild(linkBtn);
    
    // Add to book card
    const bookCard = parentP.closest('.book');
    if (bookCard) {
      bookCard.style.position = 'relative';
      bookCard.appendChild(linkContainer);
      parentP.style.display = 'none'; // Hide the original link paragraph
    }
  });
}