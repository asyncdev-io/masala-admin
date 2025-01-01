import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Agregar platillo</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nueva Categoría de Menú</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Nombre de Categoría</Label>
                <Input id="category-name" placeholder="e.g., Main Course" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-description">URL de imagen</Label>
                <Input
                  id="category-description"
                  placeholder="Enter category description"
                />
              </div>
              <Button type="submit">Agregar Categoría</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nuevo platillo</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dish-name">Nombre</Label>
                <Input id="dish-name" placeholder="e.g., Classic Burger" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Course</SelectItem>
                    <SelectItem value="starter">Starters</SelectItem>
                    <SelectItem value="dessert">Desserts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Coloca el precio"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dish-name">URL imagen</Label>
                <Input id="dish-name" placeholder="URL imagen" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Coloca la descripción del platillo"
                />
              </div>
              <Button type="submit">Agregar platillo</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
