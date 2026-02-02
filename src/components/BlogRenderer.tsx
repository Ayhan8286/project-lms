import ReactMarkdown from "react-markdown";

interface BlogRendererProps {
    content: string;
}

export const BlogRenderer = ({ content }: BlogRendererProps) => {
    return (
        <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
};
