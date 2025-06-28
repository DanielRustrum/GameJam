import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { usePanelNavigation } from "@engine/panel"
import { Button } from '@/components/UI/button';
import { ReactNode, useEffect, useRef, useState } from 'react';
import '@panels/credits.scss'
import { ScrollArea } from "@ui/scroll-area"

import credit_markdown from '@assets/credits.md?raw'
import { cn } from '@/engine/shadcn';
import { MenuBackground } from '@/components/Game/Background';

const AVATARS = Object.fromEntries(
  Object.values(
    import.meta.glob('@assets/avatars/*.png', { eager: true })
  ).map((image: any) => {
    const path = image.default as string;
    const filename = path.split("/").pop()?.split(".").slice(0, -1).join(".") || "unknown";
    return [filename, path];
  })
) as { [key: string]: string };


function Contributor({ name, role, avatar, children }: { name: string; role: string; avatar: string, children: ReactNode }) {
    return (
        <div className="m-auto min-w-[30%] justify-center">
            <img className="m-auto rounded-full pb-3" src={AVATARS[avatar]} alt={`${name}'s Avatar Image`} width={64} height={64} />
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
                'md:self-end sm:self-center sticky bottom-[-1px] px-10 py-5 right-30 transition-all duration-300 md:w-sm sm:w-10/12 mx-5',
                isPinned ? "rounded-md bg-gray-200": "rounded-t-md bg-white"
            )}
        >
            <Button className="w-full" onClick={() => { navigate("menu") }}>{children}</Button>
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
        <MenuBackground className='flex flex-col mx-5 py-5 gap-3 min-h-dvh  h-fit justify-between'>
            <h1 className='text-center text-2xl font-bold pb-4'>Credits</h1>
            <ScrollArea>
                <div id="markdown-container" className='md:mx-15 sm:mx-0 p-5 rounded-md border-0 bg-purple-400 grow h-fit m-h-screen'>
                    <Markdown
                        rehypePlugins={[rehypeRaw]}
                        components={components}
                    >
                        {credit_markdown}
                    </Markdown>
                </div>
            </ScrollArea>
            <BackToMenuButton>Back To Main Menu</BackToMenuButton>
        </MenuBackground>
    )
}

export const name = "credits"