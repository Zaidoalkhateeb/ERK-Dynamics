import Link from "next/link";
export default function NotFound(){return <main className="error-page"><p className="eyebrow">ERROR / 404</p><h1>Outside the operating range.</h1><p>The page may have moved or is no longer available.</p><Link className="button primary" href="/">Return home <span className="site-arrow" aria-hidden="true" /></Link></main>}
