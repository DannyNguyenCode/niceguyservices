import {
    DigitalCraftsmanFooter,
    DigitalCraftsmanHeader,
} from "./DigitalCraftsmanChrome";
import "./digital-craftsman-article.css";

export default function DigitalCraftsmanArticleShell({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="digital-craftsman-page">
            <DigitalCraftsmanHeader />
            {children}
            <DigitalCraftsmanFooter />
        </div>
    );
}
