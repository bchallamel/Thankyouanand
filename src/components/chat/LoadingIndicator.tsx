
import { LoaderCircle } from 'lucide-react';

const LoadingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-lg px-4 py-3 bg-muted border border-border/40">
        <div className="flex items-center space-x-2">
          <LoaderCircle className="h-4 w-4 text-primary animate-spin" />
          <span className="text-sm">Thinking...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
