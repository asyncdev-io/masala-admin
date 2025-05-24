import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Restaurant Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Información</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de restaurante</Label>
                <Input id="name" placeholder="Enter restaurant name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Descripción</Label>
                <Input id="address" placeholder="Descripción del restaurante" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Image URL</Label>
                <Input
                  id="phone"
                  placeholder="https://example.com.mx/image-url"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Categoría</Label>
                <Input id="email" type="email" placeholder="Enter category" />
              </div>
            </div>
            <Button type="submit">Guardar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}