import Workspace from "@/components/Workspace";

const STARTER_JSX = `function Playground() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 font-sans text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
          dropin · playground
        </span>
        <h1 className="mt-8 text-5xl font-semibold tracking-tight md:text-7xl">
          Paste your code
          <br />
          <span className="bg-gradient-to-r from-orange-500 via-rose-500 to-blue-600 bg-clip-text text-transparent">
            here.
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-base text-slate-600 md:text-lg">
          Replace this file with JSX or switch to HTML mode at the top.
          The preview updates every 250ms as you type.
        </p>
        <button
          onClick={() => alert("hi from the preview")}
          className="mt-10 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800"
        >
          Click me →
        </button>
      </div>
    </div>
  );
}

export default Playground;
`;

export const metadata = {
  title: "Playground — Dropin",
  description: "Paste your own HTML or JSX and see it render live.",
};

export default function PlaygroundPage() {
  return (
    <Workspace
      initialCode={STARTER_JSX}
      initialKind="jsx"
      filename="playground"
      allowKindToggle
      title="Playground"
      subtitle="Paste anything · JSX or HTML"
    />
  );
}
