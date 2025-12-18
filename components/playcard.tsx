import React from "react";

interface propTypes {
    title: string;
    description: string;
    image: string;
    link: string;
}

const PlayCard = ({ title, description, image, link }: propTypes) => {
    return (
        <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:border-primary/50 transition-all group">
            <img src={image} alt={title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-card-foreground">{title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-primary text-sm font-medium hover:text-primary/80 inline-flex items-center">
                    Learn more &rarr;
                </a>
            </div>
        </div>
    );
};

export default PlayCard;