import Image from "next/image";
import { UserPicture } from "../types/user";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

interface PictureGalleryProps {
  pictures: UserPicture[];
}

/**
 * PictureGallery Component, a React component that displays a gallery of pictures.
 * @param param0 - An object containing an array of pictures.
 * Each picture is an object with a `path` property.
 * The `path` is a string representing the location of the picture.
 * @returns
 */
export default function PictureGallery({ pictures }: PictureGalleryProps) {
  const fileserverURL = "http://localhost:3001";

  let counter = 1;
  pictures = pictures.map((picture) => {
    const result = {
      path: picture.path,
      id: `slide${counter}`,
    };
    counter++;
    return result;
  });

  counter = 1;
  let picturesHTML = pictures.map((picture) => {
    const pictureUrl = `${fileserverURL}/${picture.path}`;
    const previousId = counter == 1 ? pictures.length : counter - 1;
    const nextId = counter == pictures.length ? 1 : counter + 1;
    counter++;

    const arrowStyle =
      "rounded-full bg-orange-400 translate-y-[-50%] scale-[2] md:text-xl sm:text-base text-xs font-bold absolute top-1/2 text-white px-2 py-1 hover:bg-orange-500 transition-colors duration-300";
    return (
      <div 
        className="w-full h-full relative" 
        id={picture.id || `slide${counter}`} 
        key={picture.id}
      >
        <Image
          src={pictureUrl}
          alt={`Gallery picture ${counter - 1}`}
          width={1000}
          height={1000}
          className="w-full h-full object-cover"
          style={{ width: "100%", height: "100%" }}
        />
        <a href={`#slide${previousId}`} className={`${arrowStyle} left-5`}>
          <ArrowLeftIcon className="h-5 w-5" />
        </a>
        <a href={`#slide${nextId}`} className={`${arrowStyle} right-5`}>
          <ArrowRightIcon className="h-5 w-5" />
        </a>
      </div>
    );
  });

  return (
    <div className="overflow-y-hidden">
      <>{picturesHTML}</>
    </div>
  );
}
