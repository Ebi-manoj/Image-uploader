export default function Upload() {
  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-white px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white/95 p-8 shadow-xl backdrop-blur">
        <div className="text-center">
          <h1 className="text-4xl p-1 font-bold tracking-tight bg-linear-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent">
            Upload
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Upload your images here
          </p>
        </div>
      </div>
    </div>
  );
}
