import { Middleware } from '@reduxjs/toolkit';
import { isRejectedWithValue, isFulfilled } from '@reduxjs/toolkit';
import { toast } from 'sonner';

// List of query operations that should not trigger toasts (background/read operations)
const SILENT_OPERATIONS = [
  'login',
  'getProfile',
  'refreshToken',
  'getUsers',
  'getUserById',
  'getJobs',
  'getJobById',
  'getHouseAwbs',
  'getHouseAwbById',
  'getMasterAwbs',
  'getMasterAwbById',
  // Master data queries
  'getAirlines',
  'getAirports',
  'getShippers',
  'getConsignees',
  'getAgents',
  'getCustomsBrokers',
  'getTruckers',
  'getWarehouses',
  'getCommodities',
  'getPackageTypes',
  'getServiceTypes',
];

// Helper to check if operation should be silent
function isSilentOperation(actionType: string): boolean {
  return SILENT_OPERATIONS.some(op => actionType.toLowerCase().includes(op.toLowerCase()));
}

// Helper to check if this is a query (read) operation vs mutation (write)
function isQueryOperation(action: any): boolean {
  const meta = action.meta as any;
  const arg = meta?.arg;
  
  // If it's initiated by a hook, check if it's a query
  if (arg?.type === 'query') {
    return true;
  }
  
  // Check by endpoint name pattern
  const actionType = action.type || '';
  const operation = actionType.split('/').pop() || '';
  
  // Query operations typically start with 'get', 'fetch', or 'search'
  return operation.toLowerCase().startsWith('get') || 
         operation.toLowerCase().startsWith('fetch') ||
         operation.toLowerCase().startsWith('search');
}

// Middleware to show toast notifications for API calls
export const toastMiddleware: Middleware = () => (next) => (action: any) => {
  const actionType = action.type || '';
  
  // Check if this is a rejected action with a value (API error)
  if (isRejectedWithValue(action)) {
    // Skip toasts for query operations and silent operations
    if (!isQueryOperation(action) && !isSilentOperation(actionType)) {
      const payload = action.payload as any;
      const errorMessage = payload?.data?.message || 
                          payload?.message || 
                          action.error?.message ||
                          'An error occurred';
      
      // Extract the operation name from the action type
      const cleanActionType = actionType.replace('/rejected', '');
      const operation = cleanActionType.split('/').pop() || 'operation';
      
      toast.error(`Failed to ${formatOperation(operation)}`, {
        description: errorMessage,
        duration: 5000,
      });
    }
  }

  // Check if this is a fulfilled mutation (successful POST, PUT, DELETE)
  if (isFulfilled(action)) {
    const meta = action.meta as any;
    const cleanActionType = actionType.replace('/fulfilled', '');
    const operation = cleanActionType.split('/').pop() || '';
    
    // Check if this is a mutation (create/update/delete operation)
    const isMutation = operation.toLowerCase().includes('create') ||
                      operation.toLowerCase().includes('update') ||
                      operation.toLowerCase().includes('delete');
    
    // Only show success toast for mutations, skip queries and silent operations
    if (isMutation && !isSilentOperation(actionType)) {
      const resourceName = extractResourceName(cleanActionType);
      const operationType = getOperationType(operation);
      
      toast.success(`${resourceName} ${operationType} successfully!`, {
        duration: 3000,
      });
    }
  }

  return next(action);
};

// Helper function to format operation names
function formatOperation(operation: string): string {
  // Convert camelCase to words
  const words = operation.replace(/([A-Z])/g, ' $1').toLowerCase();
  return words.trim();
}

// Helper function to extract resource name from action type
function extractResourceName(actionType: string): string {
  const parts = actionType.split('/');
  const apiName = parts[0]; // e.g., "jobsApi", "masterAwbsApi"
  
  // Remove "Api" suffix and format the name
  const resourceName = apiName
    .replace('Api', '')
    .replace(/([A-Z])/g, ' $1')
    .trim();
  
  // Capitalize first letter
  return resourceName.charAt(0).toUpperCase() + resourceName.slice(1);
}

// Helper function to determine operation type
function getOperationType(operation: string): string {
  const op = operation.toLowerCase();
  
  if (op.includes('create')) return 'created';
  if (op.includes('update')) return 'updated';
  if (op.includes('delete')) return 'deleted';
  
  return 'saved';
}

