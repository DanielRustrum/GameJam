import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { usePanelNavigation } from "@engine/panel"
import { Button } from '@/components/UI/button';
import { ReactNode } from 'react';
import '@panels/credits.scss'

import credit_markdown from '@assets/credits.md?raw'

function Contributor({ name, role, avatar, children }: { name: string; role: string; avatar: string, children: ReactNode }) {
    return (
        <div className="contributor-card m-auto">
            <img src={avatar} alt={name} width={64} height={64} />
            <div>
                <strong>{name}</strong>
                <div>{role}</div>
                <div>{children}</div>
            </div>
        </div>
    );
}

function BackToMenuButton({ children }: { children: ReactNode }) {
    const navigate = usePanelNavigation()
    return (
        <div className='self-end sticky bottom-0 px-10 py-5 bg-white rounded-t-md right-30'>
            <Button className="max-w-sm" onClick={() => { navigate("menu") }}>{children}</Button>
        </div>
    )
}

const components: Partial<Record<string, any>> = {
    contributor: ({ node, children }: any) => {
        const { name, role, avatar } = node.properties ?? {};
        return <Contributor name={name} role={role} avatar={avatar}>{children}</Contributor>;
    },
    h1: "h2"
};

export const Panel = () => {
    return (
        <div className='flex flex-col mx-5 py-5 gap-10 min-h-dvh justify-between'>
            <h1 className='text-center text-2xl'>Credits</h1>
            <div id="markdown-container" className='mx-15 p-5 rounded-md border-0 bg-purple-400 grow h-screen'>
                <Markdown
                    rehypePlugins={[rehypeRaw]}
                    components={components}
                >
                    {credit_markdown}
                </Markdown>
            </div>
            <BackToMenuButton>Back To Main Menu</BackToMenuButton>
        </div>
    )
}

export const name = "credit"