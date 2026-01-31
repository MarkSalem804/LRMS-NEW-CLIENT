# Shadcn Components

This folder contains all shadcn/ui components, separated from the original custom components.

## Structure

```
shadcn-components/
├── ui/              # shadcn/ui components (Button, Dialog, Toast, etc.)
├── utils/           # Utility functions (cn, etc.)
└── README.md        # This file
```

## Purpose

- **Separate from original components**: Keep existing components untouched
- **Easy rollback**: If issues occur, can switch back to original components
- **Clear organization**: Distinguish between custom and shadcn components

## Setup

Before using shadcn components, install required dependencies:

```bash
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu
```

## Usage

Import shadcn components from this folder:

```jsx
import { Button } from "@/components/shadcn-components/ui/button";
import { Dialog } from "@/components/shadcn-components/ui/dialog";
```

Or use relative imports:

```jsx
import { Button } from "../shadcn-components/ui/button";
```

## Utility Functions

The `cn()` utility function is available for merging Tailwind classes:

```jsx
import { cn } from "@/components/shadcn-components/utils/cn";

// Example usage
<button className={cn("px-4 py-2", "bg-blue-500", isActive && "bg-blue-700")}>
  Click me
</button>;
```

## Migration Strategy

1. Add new features using shadcn components from this folder
2. Gradually migrate existing components if needed
3. Keep original components as backup until fully tested
4. Test thoroughly before replacing original components
