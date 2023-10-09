import {
  faFacebook,
  faTwitter,
  faInstagram,
  faYoutube,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { faEarthAmerica } from "@fortawesome/free-solid-svg-icons";

const socialMedia = {
  facebook: faFacebook,
  twitter: faTwitter,
  instagram: faInstagram,
  youtube: faYoutube,
  linkedin: faLinkedin,
  unknown: faEarthAmerica,
};

/**
 *
 * @param {string} iconGroup
 * @param {string} url
 * @returns
 */
export function parseIcon(iconGroup, url) {
  try {
    switch (iconGroup) {
      default: {
        // socialMedia
        const socialMediaNames = {
          facebook: "facebook.com",
          twitter: "twitter.com",
          instagram: "instagram.com",
          linkedin: "linkedin.com",
          youtube: "youtube.com",
        };
        if (!url || !url.length) return socialMedia.unknown;
        const hostname = new URL(url).hostname;
        let parsed = "Unknown";
        for (const [name, domain] of Object.entries(socialMediaNames))
          if (hostname.includes(domain)) parsed = name;
        return socialMedia[parsed];
      }
    }
  } catch (err) {
    console.error(err);
    return socialMedia.unknown;
  }
}
