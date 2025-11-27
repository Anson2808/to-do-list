# TaskFlow - Dark Mode To-Do List

A beautiful, fully-featured dark mode to-do list application built with vanilla HTML, CSS, and JavaScript.

![TaskFlow Screenshot](https://via.placeholder.com/800x500?text=TaskFlow+Dark+Mode+To-Do+List)

## Features

### Task Management
- ✅ **Add tasks** - Create new tasks with a single click or press Enter
- ✏️ **Edit tasks** - Modify task details via a modal dialog
- 🗑️ **Delete tasks** - Remove tasks with smooth animations
- ☑️ **Mark as complete** - Toggle task completion with a strikethrough effect

### Categories & Tags
- 💼 Work
- 🏠 Personal
- 🛒 Shopping
- 💪 Health
- 📚 Study

Color-coded tags for easy visual identification.

### Due Dates
- 📅 Date picker for setting due dates
- ⚠️ Visual indicator for overdue tasks (red highlight)
- 📆 Smart date display (Today, Tomorrow, or formatted date)

### Priority Levels
- 🔴 High Priority
- 🟡 Medium Priority
- 🟢 Low Priority

Visual distinction with colored borders and tags.

### Filtering & Sorting
- 🔍 Search tasks by text or category
- 📊 Filter by status (All, Pending, Completed)
- 🏷️ Filter by category
- ⚡ Filter by priority
- 📈 Sort by creation date, due date, priority, or name

### Data Persistence
- 💾 Automatic saving to localStorage
- 🔄 Tasks persist across browser sessions
- 📱 Categories, priorities, and completion status preserved

### Beautiful UI/UX
- 🌙 Modern dark mode aesthetic
- ✨ Smooth animations and transitions
- 📱 Fully responsive design
- 🎯 Micro-interactions for better UX
- 📊 Progress tracking with visual indicator

## Tech Stack

- **HTML5** - Semantic structure
- **CSS3** - Dark mode styling with CSS variables
- **Vanilla JavaScript** - No dependencies required

## Getting Started

### Option 1: Open directly in browser

1. Clone the repository:
   ```bash
   git clone https://github.com/Anson2808/to-do-list.git
   ```

2. Open `index.html` in your web browser

### Option 2: Use a local server

1. Clone the repository:
   ```bash
   git clone https://github.com/Anson2808/to-do-list.git
   cd to-do-list
   ```

2. Start a local server (using Python):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

3. Open `http://localhost:8000` in your browser

## File Structure

```
to-do-list/
├── index.html      # Main HTML structure
├── style.css       # Dark mode theme and styling
├── script.js       # JavaScript functionality
└── README.md       # Documentation
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Add task (when input is focused) |
| `Enter` | Save changes (when editing) |
| `Escape` | Close edit modal |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
