import { toast } from 'sonner';

export interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useToast = () => {
  return {
    success: (message: string, options?: ToastOptions) => {
      toast.success(message, {
        description: options?.description,
        duration: options?.duration || 3000,
        action: options?.action,
      });
    },
    
    error: (message: string, options?: ToastOptions) => {
      toast.error(message, {
        description: options?.description,
        duration: options?.duration || 5000,
        action: options?.action,
      });
    },
    
    info: (message: string, options?: ToastOptions) => {
      toast.info(message, {
        description: options?.description,
        duration: options?.duration || 3000,
        action: options?.action,
      });
    },
    
    warning: (message: string, options?: ToastOptions) => {
      toast.warning(message, {
        description: options?.description,
        duration: options?.duration || 4000,
        action: options?.action,
      });
    },
    
    loading: (message: string, options?: Omit<ToastOptions, 'action'>) => {
      return toast.loading(message, {
        description: options?.description,
      });
    },
    
    promise: <T,>(
      promise: Promise<T>,
      options: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: any) => string);
      }
    ) => {
      return toast.promise(promise, options);
    },
    
    dismiss: (toastId?: string | number) => {
      toast.dismiss(toastId);
    },
    
    // API-specific toast helpers
    api: {
      // Success for create operations
      created: (resourceName: string) => {
        toast.success(`${resourceName} created successfully!`, {
          duration: 3000,
        });
      },
      
      // Success for update operations
      updated: (resourceName: string) => {
        toast.success(`${resourceName} updated successfully!`, {
          duration: 3000,
        });
      },
      
      // Success for delete operations
      deleted: (resourceName: string) => {
        toast.success(`${resourceName} deleted successfully!`, {
          duration: 3000,
        });
      },
      
      // Error for failed operations
      error: (operation: string, error: any) => {
        const message = error?.data?.message || error?.message || 'An error occurred';
        toast.error(`Failed to ${operation}`, {
          description: message,
          duration: 5000,
        });
      },
      
      // Loading state for async operations
      loading: (operation: string) => {
        return toast.loading(`${operation}...`);
      },
    },
  };
};

// Export individual toast functions for direct usage
export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, { description, duration: 3000 });
  },
  
  error: (message: string, description?: string) => {
    toast.error(message, { description, duration: 5000 });
  },
  
  info: (message: string, description?: string) => {
    toast.info(message, { description, duration: 3000 });
  },
  
  warning: (message: string, description?: string) => {
    toast.warning(message, { description, duration: 4000 });
  },
};

