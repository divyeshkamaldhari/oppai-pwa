interface IErrorFallback {
    error: {
        message: string;
    };
    resetErrorBoundary: () => void;
}

export default function ErrorFallback({ error, resetErrorBoundary }: IErrorFallback) {
    return (
        <div>
            <h2>Something went wrong:</h2>
            <pre>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    );
}
