import { useState } from "react";

interface ShowroomVideoProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * Self-contained video player for the showroom.
 * - muted/loop/playsInline by default
 * - preload="metadata"
 * - On load error, falls back to the poster image
 */
export default function ShowroomVideo({
  src,
  poster = "/showroom/showroom-interior-overview.jpg",
  autoPlay = true,
  controls = false,
  className = "",
  ariaLabel,
}: ShowroomVideoProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <img
        src={poster}
        alt={ariaLabel ?? "Showroom"}
        className={className}
        loading="lazy"
      />
    );
  }

  return (
    <video
      className={className}
      src={src}
      poster={poster}
      autoPlay={autoPlay}
      muted
      loop
      playsInline
      controls={controls}
      preload="metadata"
      aria-label={ariaLabel}
      onError={() => setErrored(true)}
    />
  );
}
