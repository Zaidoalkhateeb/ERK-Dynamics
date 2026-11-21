import Link from "next/link";
export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="ERK Dynamics home">
      <span className="company-logo-mark" aria-hidden="true">
        <img src="/media/erk-dragonfly.png" alt="" width="833" height="479" />
      </span>
      <span>
        ERK <b>DYNAMICS</b>
      </span>
    </Link>
  );
}
