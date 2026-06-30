import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog, Button, Field, Input, Select, Textarea } from "../ui";
import { leadsApi } from "../../lib/services";
import {
  LEAD_STAGES,
  LEAD_PRIORITIES,
  LEAD_SOURCES,
} from "../../lib/constants";

/**
 * Create / edit a lead. When `lead` is provided we're editing; otherwise
 * creating. Calls `onSaved(lead)` so the parent can refresh its list.
 */
export function LeadFormDialog({ open, onClose, lead, onSaved }) {
  const editing = Boolean(lead?._id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Reset the form whenever the target lead changes / dialog opens.
  useEffect(() => {
    if (!open) return;

    reset({
      name: lead?.name || "",
      email: lead?.email || "",
      phone: lead?.phone || "",
      company: lead?.company || "",
      status: lead?.status || "New",
      priority: lead?.priority || "Medium",
      source: lead?.source || "Website",
      value: lead?.value || 0,
      notes: lead?.notes || "",
    });
  }, [open, lead, reset]);

  const onSubmit = async (form) => {
    const payload = {
      ...form,
      value: Number(form.value) || 0,
    };

    try {
      const res = editing
        ? await leadsApi.update(lead._id, payload)
        : await leadsApi.create(payload);

      toast.success(editing ? "Lead updated" : "Lead created");

      onSaved?.(res.lead);
      onClose();
    } catch (err) {
      toast.error(err.message || "Could not save lead");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={editing ? "Edit Lead" : "Add New Lead"}
      description={
        editing
          ? "Update customer information and opportunity details."
          : "Add a new lead to your sales pipeline."
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Customer Name"
            error={errors.name?.message}
            className="col-span-2"
          >
            <Input
              placeholder="Rahul Sharma"
              className="rounded-2xl border-violet-200 focus:border-violet-500"
              {...register("name", {
                required: "Name is required",
              })}
            />
          </Field>

          <Field label="Company">
            <Input
              placeholder="Sharma Enterprises"
              className="rounded-2xl border-violet-200 focus:border-violet-500"
              {...register("company")}
            />
          </Field>

          <Field label="Email">
            <Input
              type="email"
              placeholder="rahul@company.in"
              className="rounded-2xl border-violet-200 focus:border-violet-500"
              {...register("email")}
            />
          </Field>

          <Field label="Phone">
            <Input
              placeholder="+91 98765 43210"
              className="rounded-2xl border-violet-200 focus:border-violet-500"
              {...register("phone")}
            />
          </Field>

          <Field label="Deal Value (₹)">
            <Input
              type="number"
              min="0"
              placeholder="250000"
              className="rounded-2xl border-violet-200 focus:border-violet-500"
              {...register("value")}
            />
          </Field>

          <Field label="Stage">
            <Select
              className="rounded-2xl border-violet-200 focus:border-violet-500"
              {...register("status")}
            >
              {LEAD_STAGES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>

          <Field label="Priority">
            <Select
              className="rounded-2xl border-violet-200 focus:border-violet-500"
              {...register("priority")}
            >
              {LEAD_PRIORITIES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
          </Field>

          <Field
            label="Lead Source"
            className="col-span-2"
          >
            <Select
              className="rounded-2xl border-violet-200 focus:border-violet-500"
              {...register("source")}
            >
              {LEAD_SOURCES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>

          <Field
            label="Notes"
            className="col-span-2"
          >
            <Textarea
              rows={5}
              placeholder="Meeting summary, requirements, follow-up schedule..."
              className="rounded-2xl border-violet-200 focus:border-violet-500"
              {...register("notes")}
            />
          </Field>
        </div>

        <div className="flex justify-end gap-3 border-t border-violet-100 pt-5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-2xl"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={isSubmitting}
            className="rounded-2xl"
          >
            {editing ? "Save Changes" : "Create Lead"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}