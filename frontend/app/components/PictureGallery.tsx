interface PictureGalleryProps {
    pictures: [object]
}

export default function PictureGallery({pictures} : PictureGalleryProps )  {
    const fileserverURL="http://localhost:3001"
    
    let counter = 1
    pictures = pictures.map(picture => {
        const result = {
            path: picture.path,
            id: `slide${counter}`
        }
        counter++
        return result
    })

    counter = 1
    let picturesHTML = pictures.map(picture => {
        const pictureUrl = `${fileserverURL}/${picture.path}`
        const previousId = counter == 1 ? pictures.length : (counter - 1)
        const nextId = counter == pictures.length ? 1: (counter + 1)
        counter++

        const arrowStyle = "rounded-full bg-orange-400 translate-y-[-50%] scale-[2] md:text-xl sm:text-base text-xs font-bold absolute top-1/2 text-white px-2"
        return (
            <div 
                className="w-full h-full relative"
                id={picture.id}
            >
                <img 
                    src={pictureUrl} width="100%"
                    className="w-full h-full object-cover "
                />
                <a href={`#slide${previousId}`} className={`${arrowStyle} left-5`}>
                    &lt;
                </a>
                <a href={`#slide${nextId}`} className={`${arrowStyle} right-5`}>
                    &gt;
                </a>
            </div>
            
        )
    })

    return (
        <div className="overflow-y-hidden">
            <>
                {picturesHTML}
            </>
        </div>
    )
}