import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface props {
  title: string;
  data?: string | number;
  children: React.ReactNode;
  color: string;
}

const InfoCard = ({ title, data, children, color }: props) => {
  const colors: any = {
    purple: "p-3 rounded-xl size-12 bg-purple-background text-purple",
    cyan: "p-3 rounded-xl size-12 bg-cyan-background text-cyan",
    orange: "p-3 rounded-xl size-12 bg-orange-background text-orange",
    blue: "p-3 rounded-xl size-12 bg-blue-background text-blue",
    green: "p-3 rounded-xl size-12 bg-green-background text-green",
    yellow: "p-3 rounded-xl size-12 bg-yellow-background text-yellow",
    gray: "p-3 rounded-xl size-12 bg-gray-background text-gray",
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Card className="flex items-center">
      <CardContent className="flex gap-4 items-center  p-3 lg:p-6">
        <div className={colors[color]}>{children}</div>
        <div >
          <div className="text-sm text-muted-foreground ">{title}</div>
          <div className="text-2xl font-semibold">{data || 0}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
