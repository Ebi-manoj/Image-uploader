export default function Footer() {
  return (
    <footer className="bg-white py-2">
      <div className="container mx-auto flex h-16 items-center justify-center px-4 md:px-8">
        <p className="text-sm text-slate-500 text-center">
          &copy; {new Date().getFullYear()} Image Uploader. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
