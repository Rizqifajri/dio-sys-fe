"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import { createMenuSchema, type CreateMenuValues } from "../schemas/menu"
import { useCreateMenu, useUpdateMenu } from "../hooks/use-menus"
import { useCategories } from "../hooks/use-categories"
import type { Menu } from "../types"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  editTarget?: Menu
}

export function MenuFormDialog({ open, onOpenChange, editTarget }: Props) {
  const isEdit = !!editTarget
  const { mutate: create, isPending: creating } = useCreateMenu()
  const { mutate: update, isPending: updating } = useUpdateMenu()
  const { data: categories = [] } = useCategories()
  const isPending = creating || updating

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMenuValues>({
    resolver: zodResolver(createMenuSchema),
    defaultValues: { isAvailable: true },
  })

  useEffect(() => {
    if (editTarget) {
      reset({
        name: editTarget.name,
        categoryId: editTarget.categoryId,
        description: editTarget.description ?? "",
        price: editTarget.price / 100,
        imageUrl: editTarget.imageUrl ?? "",
        isAvailable: editTarget.isAvailable,
      })
    } else {
      reset({ isAvailable: true, price: undefined, categoryId: "" })
    }
  }, [editTarget, open, reset])

  function onSubmit(values: CreateMenuValues) {
    if (isEdit) {
      update(
        { id: editTarget.id, ...values },
        { onSuccess: () => onOpenChange(false) },
      )
    } else {
      create(values, { onSuccess: () => onOpenChange(false) })
    }
  }

  const inputClass =
    "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 aria-invalid:border-destructive"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldSet disabled={isPending}>
            <FieldGroup>
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="menu-name">Name</FieldLabel>
                <Input
                  id="menu-name"
                  placeholder="e.g. Caesar Salad"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
                <FieldError errors={[errors.name]} />
              </Field>

              <Field data-invalid={!!errors.categoryId}>
                <FieldLabel htmlFor="menu-category">Category</FieldLabel>
                <select
                  id="menu-category"
                  aria-invalid={!!errors.categoryId}
                  className={cn(inputClass, "bg-background")}
                  {...register("categoryId")}
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <FieldError errors={[errors.categoryId]} />
              </Field>

              <Field data-invalid={!!errors.description}>
                <FieldLabel htmlFor="menu-desc">Description</FieldLabel>
                <textarea
                  id="menu-desc"
                  rows={2}
                  placeholder="Optional description…"
                  aria-invalid={!!errors.description}
                  className={cn(inputClass, "h-auto resize-none py-1.5")}
                  {...register("description")}
                />
                <FieldError errors={[errors.description]} />
              </Field>

              <Field data-invalid={!!errors.price}>
                <FieldLabel htmlFor="menu-price">Price</FieldLabel>
                <Input
                  id="menu-price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  aria-invalid={!!errors.price}
                  {...register("price")}
                />
                <FieldError errors={[errors.price]} />
              </Field>

              <Field data-invalid={!!errors.imageUrl}>
                <FieldLabel htmlFor="menu-img">Image URL</FieldLabel>
                <Input
                  id="menu-img"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  aria-invalid={!!errors.imageUrl}
                  {...register("imageUrl")}
                />
                <FieldError errors={[errors.imageUrl]} />
              </Field>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="menu-available"
                  type="checkbox"
                  className="size-4 rounded border-input"
                  {...register("isAvailable")}
                />
                <label htmlFor="menu-available" className="text-sm font-medium">
                  Available
                </label>
              </div>
            </FieldGroup>
          </FieldSet>
          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
