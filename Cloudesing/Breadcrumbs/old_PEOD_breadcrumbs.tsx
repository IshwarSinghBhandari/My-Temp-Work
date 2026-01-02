'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useMemo } from 'react';

const Breadcrumbs = () => {
  const pathname = usePathname();

  // Precompute paths only when pathname changes
  const paths = useMemo(
    () => pathname?.split('/').filter(Boolean) || [],
    [pathname]
  );

  if (paths.length === 0) return null; // Skip rendering on home page

  // Convert segment to proper display name
  const formatName = (name: string) =>
    name
      .replace(/-/g, ' ') // replace dashes with spaces
      .split(' ') // split words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize first letter
      .join(' ');

  return (
    <nav
      className="text-[11px] md:text-sm text-gray-500 px-4 md:px-[70px] py-[2px] overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-x-2 py-[8px] whitespace-nowrap">
        {/* Home link */}
        <li>
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
        </li>

        {/* Other segments */}
        {paths.map((segment, index) => {
          const isLast = index === paths.length - 1;
          const name = formatName(segment);
          const href = "/" + paths.slice(0, index + 1).join("/");

          return (
            <li key={href} className="flex items-center">
              <span aria-hidden="true">›</span>
              {isLast ? (
                <span className="ml-2 text-red-500">{name}</span>
              ) : (
                <Link href={href} className="ml-2 hover:text-gray-700">
                  {name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>

  );
};

export default memo(Breadcrumbs);
