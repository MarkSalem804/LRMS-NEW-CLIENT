import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn-components/ui/dialog";
import { Button } from "@/components/shadcn-components/ui/button";
import { Input } from "@/components/shadcn-components/ui/input";
import {
  Field,
  FieldLabel,
  FieldContent,
} from "@/components/shadcn-components/ui/field";
import { RotateCcw } from "lucide-react";

const AdminResetPasswordModal = ({
  open,
  onOpenChange,
  user,
  onSave,
  isLoading,
}) => {
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setGeneratedPassword("");
      setError("");
    }
  }, [open]);

  const generateRandomPassword = () => {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let result = "";
    const charsetLength = charset.length;
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charsetLength));
    }
    return result;
  };

  const handleGeneratePassword = () => {
    const randomPassword = generateRandomPassword();
    setGeneratedPassword(randomPassword);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!generatedPassword) {
      setError("Please generate a password first.");
      return;
    }

    onSave(generatedPassword);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Account Password Reset</DialogTitle>
          <DialogDescription>
            Generate a new password for {user?.email || "this user"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Field className="py-4">
            <FieldLabel>Generated Password</FieldLabel>
            <FieldContent>
              <div className="relative">
                <Input
                  type="text"
                  value={generatedPassword}
                  readOnly
                  disabled
                  className="bg-gray-50 pr-10"
                  placeholder="Click the refresh icon to generate a password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleGeneratePassword}
                  disabled={isLoading}
                  className="absolute right-0 top-0 h-full rounded-l-none"
                  title="Generate Password"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </FieldContent>
          </Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !generatedPassword}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

AdminResetPasswordModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string.isRequired,
  }), // Made optional since component handles null case gracefully
  onSave: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default AdminResetPasswordModal;
