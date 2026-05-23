"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

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
import { useUserRole } from "@/features/auth/hooks/use-permissions"
import { PERMISSIONS, ROLES } from "@/constants/permissions"

import { useCreateRole, useUpdateRole } from "../hooks/use-roles"
import type { RoleRecord } from "../types"

// ─── Static permission groups from local constants (no API call needed) ───────

const PERMISSION_GROUPS: { label: string; perms: string[] }[] = [
  {
    label: "Tenant",
    perms: [PERMISSIONS.TENANT_READ, PERMISSIONS.TENANT_CREATE, PERMISSIONS.TENANT_UPDATE, PERMISSIONS.TENANT_DELETE],
  },
  {
    label: "Users",
    perms: [PERMISSIONS.USER_READ, PERMISSIONS.USER_CREATE, PERMISSIONS.USER_UPDATE, PERMISSIONS.USER_DELETE],
  },
  {
    label: "Roles",
    perms: [PERMISSIONS.ROLE_READ, PERMISSIONS.ROLE_CREATE, PERMISSIONS.ROLE_UPDATE, PERMISSIONS.ROLE_DELETE],
  },
  {
    label: "Category",
    perms: [PERMISSIONS.CATEGORY_READ, PERMISSIONS.CATEGORY_CREATE, PERMISSIONS.CATEGORY_UPDATE, PERMISSIONS.CATEGORY_DELETE],
  },
  {
    label: "Menu",
    perms: [PERMISSIONS.MENU_READ, PERMISSIONS.MENU_CREATE, PERMISSIONS.MENU_UPDATE, PERMISSIONS.MENU_DELETE],
  },
  {
    label: "Order",
    perms: [PERMISSIONS.ORDER_READ, PERMISSIONS.ORDER_CREATE, PERMISSIONS.ORDER_UPDATE, PERMISSIONS.ORDER_DELETE],
  },
  {
    label: "Payment",
    perms: [PERMISSIONS.PAYMENT_READ, PERMISSIONS.PAYMENT_CREATE],
  },
]

function actionLabel(perm: string) {
  const action = perm.split(":")[1] ?? perm
  return action.charAt(0).toUpperCase() + action.slice(1)
}

// ─── Form schema ──────────────────────────────────────────────────────────────

const roleFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  scope: z.enum(["TENANT", "GLOBAL"]),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
})
type RoleFormValues = z.infer<typeof roleFormSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  editTarget?: RoleRecord
}

export function RoleFormDialog({ open, onOpenChange, editTarget }: Props) {
  const isEdit = !!editTarget
  const { mutate: create, isPending: creating } = useCreateRole()
  const { mutate: update, isPending: updating } = useUpdateRole()
  const userRole = useUserRole()
  const isPending = creating || updating
  const canSetGlobal = userRole === ROLES.SUPER_ADMIN

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } =
    useForm<RoleFormValues>({
      resolver: zodResolver(roleFormSchema),
      defaultValues: { name: "", scope: "TENANT", permissions: [] },
    })

  const selected = watch("permissions")

  useEffect(() => {
    reset({
      name: editTarget?.name ?? "",
      scope: editTarget?.scope ?? "TENANT",
      permissions: [],
    })
  }, [editTarget, open, reset])

  function toggle(perm: string) {
    const cur = selected ?? []
    setValue(
      "permissions",
      cur.includes(perm) ? cur.filter((p) => p !== perm) : [...cur, perm],
      { shouldValidate: true },
    )
  }

  function toggleGroup(perms: string[]) {
    const cur = selected ?? []
    const allOn = perms.every((p) => cur.includes(p))
    setValue(
      "permissions",
      allOn ? cur.filter((p) => !perms.includes(p)) : Array.from(new Set([...cur, ...perms])),
      { shouldValidate: true },
    )
  }

  function onSubmit(values: RoleFormValues) {
    if (isEdit) {
      update(
        { id: editTarget.id, name: values.name, permissionIds: values.permissions },
        { onSuccess: () => onOpenChange(false) },
      )
    } else {
      create(
        { name: values.name, scope: values.scope, permissionIds: values.permissions },
        { onSuccess: () => onOpenChange(false) },
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Role" : "Add Role"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldSet disabled={isPending}>
            <FieldGroup>
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="role-name">Name</FieldLabel>
                <Input
                  id="role-name"
                  placeholder="e.g. Kitchen Staff"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
                <FieldError errors={[errors.name]} />
              </Field>

              {canSetGlobal && !isEdit && (
                <Field data-invalid={!!errors.scope}>
                  <FieldLabel htmlFor="role-scope">Scope</FieldLabel>
                  <select
                    id="role-scope"
                    className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    {...register("scope")}
                  >
                    <option value="TENANT">Tenant</option>
                    <option value="GLOBAL">Global</option>
                  </select>
                  <FieldError errors={[errors.scope]} />
                </Field>
              )}

              <Field data-invalid={!!errors.permissions}>
                <FieldLabel>
                  Permissions
                  {isEdit && (
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      (re-select to update)
                    </span>
                  )}
                </FieldLabel>
                <div className="max-h-60 overflow-y-auto rounded-lg border p-3 space-y-4">
                  {PERMISSION_GROUPS.map((group) => {
                    const allOn = group.perms.every((p) => selected?.includes(p))
                    return (
                      <div key={group.label}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <input
                            type="checkbox"
                            id={`grp-${group.label}`}
                            checked={allOn}
                            onChange={() => toggleGroup(group.perms)}
                            className="size-3.5 rounded border-input"
                          />
                          <label
                            htmlFor={`grp-${group.label}`}
                            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground cursor-pointer"
                          >
                            {group.label}
                          </label>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 pl-5">
                          {group.perms.map((perm) => (
                            <label key={perm} className="flex items-center gap-1.5 text-sm cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selected?.includes(perm) ?? false}
                                onChange={() => toggle(perm)}
                                className="size-3.5 rounded border-input"
                              />
                              {actionLabel(perm)}
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <FieldError errors={[errors.permissions]} />
              </Field>
            </FieldGroup>
          </FieldSet>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
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
