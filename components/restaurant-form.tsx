import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import Loader from "@/components/ui/loader";
import { useRef, useState, useEffect } from "react";

interface RestaurantFormProps {
  initialValues: Partial<{
    name: string;
    description: string;
    imageUrl: string;
    categoryId: string;
    email?: string;
    labelIds: string[];
  }>;
  categories: { id: string; name: string }[];
  labels: { id: string; name: string }[];
  mode?: "create" | "edit";
  isLoading?: boolean;
  onSubmit: (data: FormData | Record<string, any>, file?: File | null) => Promise<void>;
  warnings?: string[];
}

export default function RestaurantForm({
  initialValues,
  categories,
  labels,
  mode = "create",
  isLoading = false,
  onSubmit,
  warnings = [],
}: RestaurantFormProps) {
  const [form, setForm] = useState({
    name: initialValues.name || "",
    description: initialValues.description || "",
    imageUrl: initialValues.imageUrl || "",
    categoryId: initialValues.categoryId || "-1",
    email: initialValues.email || "",
    labelIds: initialValues.labelIds || [],
  });
  const [selectedLabels, setSelectedLabels] = useState<string[]>(initialValues.labelIds || []);
  const uploadImgInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm({
      name: initialValues.name || "",
      description: initialValues.description || "",
      imageUrl: initialValues.imageUrl || "",
      categoryId: initialValues.categoryId || "-1",
      email: initialValues.email || "",
      labelIds: initialValues.labelIds || [],
    });
    setSelectedLabels(initialValues.labelIds || []);
  }, [initialValues]);

  const handleLabelSelect = (value: string) => {
    if (!selectedLabels.includes(value)) {
      setSelectedLabels([...selectedLabels, value]);
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setSelectedLabels(selectedLabels.filter(label => label !== labelToRemove));
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleCategoryChange(value: string) {
    setForm((prev) => ({ ...prev, categoryId: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let file: File | null = null;
    if (uploadImgInputRef.current?.files?.[0]) {
      file = uploadImgInputRef.current.files[0];
    }
    if (mode === "create") {
      // Enviar como FormData para creación
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("imageUrl", "");
      formData.append("categoryId", form.categoryId);
      formData.append("email", form.email);
      formData.append("labelIds", JSON.stringify(selectedLabels));
      if (file) formData.append("restaurantImage", file);
      await onSubmit(formData, file);
    } else {
      // Enviar como objeto para edición
      const data: Record<string, any> = {
        name: form.name,
        description: form.description,
        imageUrl: form.imageUrl,
        categoryId: form.categoryId,
        labelIds: selectedLabels,
      };
      await onSubmit(data, file);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Restaurante</Label>
        <Input
          value={form.name}
          id="name"
          name="name"
          placeholder="Ingrese el nombre del restaurante"
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describa su restaurante"
          className="min-h-[100px]"
          onChange={handleChange}
          value={form.description}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Imagen del Restaurante</Label>
        {/* Mostrar imagen solo en modo edición */}
        {mode === "edit" && form.imageUrl && (
          <div className="mt-2">
            <img
              src={form.imageUrl}
              alt="Imagen actual del restaurante"
              className="w-40 h-32 object-cover rounded"
            />
            <p className="text-xs text-muted-foreground">Imagen actual</p>
          </div>
        )}
        <Input id="image" type="file" accept="image/*" ref={uploadImgInputRef} />
        
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Categoría</Label>
        <Select value={form.categoryId} onValueChange={handleCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories && categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Mostrar email solo en modo creación */}
      {mode === "create" && (
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            value={form.email}
            id="email"
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
      )}
      <div className="space-y-2">
        <Label>Etiquetas</Label>
        <Select onValueChange={handleLabelSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Agregar etiqueta" />
          </SelectTrigger>
          <SelectContent>
            {labels && labels.map((label) => (
              <SelectItem
                key={label.id}
                value={label.id}
                disabled={selectedLabels.includes(label.id)}
              >
                {label.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-2 flex flex-wrap gap-2 border rounded-md p-2 min-h-[50px]">
          {labels && selectedLabels.map((labelValue: string) => {
            const label = labels.find(l => l.id === labelValue);
            return (
              <Badge key={labelValue} variant="secondary" className="flex items-center gap-1">
                {label?.name}
                <button
                  type="button"
                  onClick={() => removeLabel(labelValue)}
                  className="hover:bg-gray-200 rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader size="sm" />
            <span className="ml-2">{mode === "create" ? "Creando restaurante..." : "Guardando cambios..."}</span>
          </>
        ) : mode === "create" ? "Crear Restaurante" : "Guardar Cambios"}
      </Button>
      {warnings && warnings.map((warning) => (
        <p key={warning} className="text-yellow-500 mt-2">{warning}</p>
      ))}
    </form>
  );
}
