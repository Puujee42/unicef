export interface Opportunity {
  id: string;
  type: 'scholarship' | 'internship' | 'volunteer';
  title: { en: string; mn: string };
  provider: { en: string; mn: string };
  location: { en: string; mn: string };
  deadline: string;
  description: { en: string; mn: string };
  requirements: { en: string[]; mn: string[] };
  tags: string[];
  link: string; // External application link
  image?: string;
  postedDate: string;
}

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: "1",
    type: "scholarship",
    title: { en: "Global Health Scholarship", mn: "Дэлхийн Эрүүл Мэндийн Тэтгэлэг" },
    provider: { en: "UNICEF Mongolia", mn: "ЮНИСЕФ Монгол" },
    location: { en: "Ulaanbaatar", mn: "Улаанбаатар" },
    deadline: "2025-03-30",
    postedDate: "2025-01-01",
    description: { 
      en: "Supporting students committed to improving public health in rural areas. This scholarship covers full tuition for one academic year and provides a monthly stipend.", 
      mn: "Орон нутгийн нийгмийн эрүүл мэндийг сайжруулахад хувь нэмэр оруулах хүсэлтэй оюутнуудад зориулав. Энэхүү тэтгэлэг нь нэг жилийн сургалтын төлбөр болон сарын тэтгэмжийг олгоно." 
    },
    requirements: {
      en: ["GPA 3.5+", "Essay on rural health", "Reference letter"],
      mn: ["Голч дүн 3.5+", "Хөдөөгийн эрүүл мэндийн талаар эссэ", "Тодорхойлолт захидал"]
    },
    tags: ["Health", "Public", "Grant"],
    link: "https://www.unicef.org/mongolia",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "2",
    type: "internship",
    title: { en: "Social Media Marketing Intern", mn: "Сошиал Медиа Маркетингийн Дадлагажигч" },
    provider: { en: "Save the Children", mn: "Хүүхдийг Ивээх Сан" },
    location: { en: "Remote / Ulaanbaatar", mn: "Зайнаас / Улаанбаатар" },
    deadline: "2025-02-15",
    postedDate: "2025-01-05",
    description: { 
      en: "Gain experience in non-profit communication and advocacy. You will help manage social media accounts, create engaging content, and assist with campaign launches.", 
      mn: "Ашгийн бус байгууллагын харилцаа холбоо, нөлөөллийн ажилд туршлага хуримтлуулах боломж. Та сошиал хуудсуудыг хөтлөх, контент бэлтгэх, аянд туслах болно." 
    },
    requirements: {
      en: ["Strong writing skills", "Basic graphic design", "English proficiency"],
      mn: ["Бичгийн ур чадвар сайн", "График дизайны анхан шатны мэдлэгтэй", "Англи хэлний мэдлэгтэй"]
    },
    tags: ["Marketing", "Social", "NGO"],
    link: "https://mongolia.savethechildren.net/",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "3",
    type: "volunteer",
    title: { en: "Youth Health Ambassador", mn: "Залуучуудын Эрүүл Мэндийн Элч" },
    provider: { en: "MNUMS UNICEF Club", mn: "АШУҮИС ЮНИСЕФ Клуб" },
    location: { en: "Universities", mn: "Их дээд сургуулиуд" },
    deadline: "2025-01-20",
    postedDate: "2024-12-25",
    description: { 
      en: "Promote healthy lifestyle choices among university peers. Ambassadors will organize small events, distribute informational materials, and act as role models.", 
      mn: "Их сургуулийн оюутнуудын дунд эрүүл амьдралын хэв маягийг сурталчлах. Элч нар жижиг арга хэмжээ зохион байгуулж, мэдээлэл түгээж, үлгэр дуурайл үзүүлнэ." 
    },
    requirements: {
      en: ["Active student", "Passion for health", "Communication skills"],
      mn: ["Идэвхтэй оюутан", "Эрүүл мэндийн төлөөх хүсэл эрмэлзэл", "Харилцааны ур чадвар"]
    },
    tags: ["Youth", "Health", "Leadership"],
    link: "#",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2074&auto=format&fit=crop"
  }
];
