import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { usePanelNavigation } from "@engine/panel"
import { Button } from '@/components/UI/button';
import { ReactNode, useEffect, useRef, useState } from 'react';
import '@panels/credits.scss'
import { ScrollArea } from "@ui/scroll-area"

import credit_markdown from '@assets/credits.md?raw'
import { cn } from '@/engine/shadcn';

const AVATARS: { [key: string]: string } = {
    "": ""
}

function Contributor({ name, role, avatar, children }: { name: string; role: string; avatar: string, children: ReactNode }) {
    return (
        <div className="contributor-card m-auto min-w-[30%] justify-center">
            <img className="m-auto rounded-full" src={AVATARS[avatar]} alt={name} width={64} height={64} />
            <div>
                <p><strong>{name}</strong></p>
                <p>{role}</p>
                <p>{children}</p>
            </div>
        </div>
    );
}

function BackToMenuButton({ children }: { children: ReactNode }) {
    const navigate = usePanelNavigation()
    const buttonRef = useRef<HTMLDivElement>(null);
    const [isPinned, setIsPinned] = useState(true);

    useEffect(() => {
        const el = buttonRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsPinned(entry.intersectionRatio === 1);
            },
            { threshold: [1] }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={buttonRef}
            className={cn(
                'self-end sticky bottom-[-1px] px-10 py-5 right-30 bg-gray-500 transition-all duration-300',
                isPinned ? "rounded-md": "rounded-t-md" 
            )}
        >
            <Button className="max-w-sm" onClick={() => { navigate("menu") }}>{children}</Button>
        </div>
    )
}

const components: Partial<Record<string, any>> = {
    contributor: ({ node, children }: any) => {
        const { name, role, avatar } = node.properties ?? {};
        return <Contributor name={name} role={role} avatar={avatar}>{children}</Contributor>;
    },
    h1: "h2",
    space: ({ }) => <br />
};

export const Panel = () => {
    return (
        <div className='flex flex-col mx-5 py-5 gap-3 min-h-dvh justify-between'>
            <h1 className='text-center text-2xl font-bold pb-4'>Credits</h1>
            <ScrollArea>
                <div id="markdown-container" className='mx-15 p-5 rounded-md border-0 bg-purple-400 grow h-screen'>
                    <Markdown
                        rehypePlugins={[rehypeRaw]}
                        components={components}
                    >
                        {credit_markdown}
                    </Markdown>
                </div>
            </ScrollArea>
            <BackToMenuButton>Back To Main Menu</BackToMenuButton>
        </div>
    )
}

export const name = "credit"