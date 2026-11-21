export function IndustryGlyph({ id }: { id: string }) {
  switch (id) {
    case "manufacturing":
      return (
        <g>
          <g className="ind-glyph-primary">
            <circle cx="60" cy="52" r="20" />
            <circle cx="60" cy="52" r="7" />
            <path d="M60 24v8M60 72v8M32 52h8M80 52h8M74 66l6 6M46 66l-6 6M46 38l-6-6M74 38l6-6" />
          </g>
          <path d="M30 98h60" />
          <path d="M42 98v0M60 98v0M78 98v0" />
          <circle cx="42" cy="98" r="3.5" />
          <circle cx="60" cy="98" r="3.5" />
          <circle cx="78" cy="98" r="3.5" />
        </g>
      );
    case "logistics":
      return (
        <g>
          <g className="ind-glyph-primary">
            <path d="M50 28h24v20H50z" />
            <path d="M34 50h26v24H34z" />
            <path d="M62 50h24v24H62z" />
            <path d="M60 28v20M46 50v24M74 50v24" />
          </g>
          <path d="M30 78h60" />
          <path d="M38 78v8M82 78v8" />
        </g>
      );
    case "automotive":
      return (
        <g className="ind-glyph-primary">
          <path d="M28 70V60c0-3 2-5 5-5h6l8-10h22l8 10h6c3 0 5 2 5 5v10" />
          <path d="M24 70h72" />
          <path d="M46 55l-4 0M74 55h4" />
          <circle cx="44" cy="72" r="8" />
          <circle cx="80" cy="72" r="8" />
        </g>
      );
    case "construction":
      return (
        <g>
          <path d="M40 92V34" />
          <path d="M40 34h46" />
          <path d="M40 48 84 34" />
          <g className="ind-glyph-primary">
            <path d="M78 34v12" />
            <path d="M72 46h12v9H72z" />
          </g>
          <path d="M28 92h40" />
          <path d="M34 92l6-8 6 8" />
        </g>
      );
    case "shipbuilding":
      return (
        <g>
          <g className="ind-glyph-primary">
            <path d="M24 68h72L84 84H38L24 68Z" />
            <path d="M42 68V42h34v26M48 42V30h18v12" />
          </g>
          <path
            className="ind-glyph-secondary"
            d="M30 91c8-5 16-5 24 0 8-5 16-5 24 0 6-4 12-5 18-2"
          />
        </g>
      );
    default:
      return null;
  }
}
