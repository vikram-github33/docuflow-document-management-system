import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { UserAvatar, StatusPill } from "../components/ui/SharedUI";
import { mockUsers } from "../data/mockData";
import { User, UserRole } from "../types";
import * as Yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  createUser,
  getAlluser,
  getUserById,
  updateUser,
} from "services/user.service";
const ROLE_STYLES: Record<
  UserRole,
  { bg: string; color: string; border: string }
> = {
  Administrator: { bg: "#EDE9FE", color: "#5B21B6", border: "#DDD6FE" },
  Manager: { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
  Employee: { bg: "#F3F4F6", color: "#374151", border: "#E5E7EB" },
};

const COLS = ["User", "Role", "Department", "Status", "Last Active", "Actions"];

const UserManagement: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const[onSelecteduserId,SetSelectedUserId] = useState('')
  const UserSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    passwordHash:
    isEdit?Yup.string():
    Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    employeeId: Yup.string().required("Employee ID is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Enter a valid 10 digit phone number")
      .required("Phone number is required"),
    department: Yup.string().required("Department is required"),
    designation: Yup.string().required("Designation is required"),
    role: Yup.string().required("Role is required"),
    isActive: Yup.boolean().required(),
  });

  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    passwordHash: "",
    employeeId: "",
    phone: "",
    department: "",
    designation: "",
    role: "USER",
    isActive: true,
  };

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });

  const { reset } = methods;

  // const filtered = mockUsers.filter(
  //   (u) =>
  //     u.name.toLowerCase().includes(search.toLowerCase()) ||
  //     u.email.toLowerCase().includes(search.toLowerCase()),
  // );
  const onSubmit = async (data: any) => {
    console.log("data", data);
    delete data.passwordHash
    try {
      if (isEdit) {
        const response = await updateUser(onSelecteduserId, data);
        if (response.data) {
          console.log("User updated");
          reset()
        }
      } else {
        const response = await createUser(data);
        if (response.data) {
          console.log("User Created");
        }
      }
      getUsersList()
      setOpen(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getUsersList = async () => {
    try {
      const response = await getAlluser();
      if (response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const getuserDataByuserId = async (id: string) => {
    try {
      const response = await getUserById(id);
      SetSelectedUserId(id)
      if (response.data) {
        const user = response.data;
        reset({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          passwordHash: "",
          employeeId: user.employeeId || "",
          phone: user.phone || "",
          department: user.department || "",
          designation: user.designation || "",
          role: user.role || "USER",
          isActive: user.isActive ?? true,
        });
        setOpen(true);
        setIsEdit(true);
        // setUsers(response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  console.log("getAllUser", users);
  useEffect(() => {
    getUsersList();
  }, []);
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 600 }}>
        User Management
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
        Manage users, roles, and permissions.
      </Typography>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "grey.200",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid",
            borderColor: "grey.200",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography sx={{ fontWeight: 600 }}>Users</Typography>
          <TextField
            size="small"
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              ml: "auto",
              width: 220,
              "& .MuiOutlinedInput-root": {
                borderRadius: 6,
                fontSize: "0.8125rem",
              },
            }}
          />
          <Button
            variant="contained"
            size="small"
            startIcon={<PersonAddIcon />}
            onClick={() => setOpen(true)}
          >
            Add user
          </Button>
        </Box>

        {/* Column headers */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
            px: 2,
            py: 1,
            borderBottom: "1px solid",
            borderColor: "grey.100",
            bgcolor: "grey.50",
          }}
        >
          {COLS.map((h) => (
            <Typography
              key={h}
              variant="overline"
              sx={{
                fontSize: "0.6rem",
                color: "text.secondary",
                textAlign: "center",
              }}
            >
              {h}
            </Typography>
          ))}
        </Box>

        {/* Rows */}
        {users.map((u: any) => {
          // const rc = ROLE_STYLES[u.role] ?? ROLE_STYLES.Employee;
          return (
            <Box
              key={u.id}
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
                px: 2,
                py: 1.25,
                borderBottom: "1px solid",
                borderColor: "grey.100",
                alignItems: "center",
                "&:hover": { bgcolor: "grey.50" },
                "&:last-child": { borderBottom: "none" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <UserAvatar
                  initials={u.initials}
                  bg={u.color}
                  textColor={u.textColor}
                  size={32}
                />
                <Box>
                  <Typography sx={{ fontSize: "0.8125rem", fontWeight: 500 }}>
                    {`${u.firstName} ${u.lastName}`}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {u.email}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={u.role}
                size="small"
                sx={{
                  // bgcolor: rc.bg,
                  // color: rc.color,
                  // border: `1px solid ${rc.border}`,
                  fontWeight: 600,
                  height: 20,
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  color: "text.secondary",
                  textAlign: "center",
                }}
              >
                {u.department}
              </Typography>
              <StatusPill status={u.isActive} />
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "text.secondary",
                  textAlign: "center",
                }}
              >
                {u.isActive ? "Active" : "InActive"}
              </Typography>
              <Box sx={{ display: "flex", gap: 0.75 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<EditIcon sx={{ fontSize: 12 }} />}
                  sx={{
                    fontSize: "0.7rem",
                    minWidth: 0,
                    px: 1,
                    borderColor: "grey.300",
                    color: "text.secondary",
                  }}
                  onClick={() => {
                    getuserDataByuserId(u?.id);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: "0.7rem",
                    minWidth: 0,
                    px: 1,
                    borderColor: "grey.300",
                    color: "text.secondary",
                  }}
                >
                  ···
                </Button>
              </Box>
            </Box>
          );
        })}
      </Paper>

      {/* Add User Dialog */}
      {/* <FormProvider {...methods}> */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <form
          onSubmit={methods.handleSubmit(onSubmit, (errors) => {
            console.log("Validation Errors", errors);
          })}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>Create User</DialogTitle>

          <DialogContent
            sx={{
              pt: "12px !important",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
            }}
          >
            <TextField
              label="First Name"
              {...methods.register("firstName")}
              error={!!methods.formState.errors.firstName}
              helperText={methods.formState.errors.firstName?.message}
              size="small"
              fullWidth
            />

            <TextField
              label="Last Name"
              {...methods.register("lastName")}
              error={!!methods.formState.errors.lastName}
              helperText={methods.formState.errors.lastName?.message}
              size="small"
              fullWidth
            />

            <TextField
              label="Email"
              type="email"
              {...methods.register("email")}
              error={!!methods.formState.errors.email}
              helperText={methods.formState.errors.email?.message}
              size="small"
              fullWidth
            />
            {isEdit ? (
              ""
            ) : (
              <TextField
                label="Password"
                type="password"
                {...methods.register("passwordHash")}
                error={!!methods.formState.errors.passwordHash}
                helperText={methods.formState.errors.passwordHash?.message}
                size="small"
                fullWidth
              />
            )}

            <TextField
              label="Employee ID"
              {...methods.register("employeeId")}
              error={!!methods.formState.errors.employeeId}
              helperText={methods.formState.errors.employeeId?.message}
              size="small"
              fullWidth
            />

            <TextField
              label="Phone"
              size="small"
              {...methods.register("phone")}
              error={!!methods.formState.errors.phone}
              helperText={methods.formState.errors.phone?.message}
              fullWidth
            />

            <TextField
              label="Department"
              size="small"
              {...methods.register("department")}
              error={!!methods.formState.errors.department}
              helperText={methods.formState.errors.department?.message}
              fullWidth
            />

            <TextField
              label="Designation"
              {...methods.register("designation")}
              error={!!methods.formState.errors.designation}
              helperText={methods.formState.errors.designation?.message}
              size="small"
              fullWidth
            />

            <TextField
              select
              label="Role"
              size="small"
              {...methods.register("role")}
              error={!!methods.formState.errors.role}
              helperText={methods.formState.errors.role?.message}
              fullWidth
              defaultValue="USER"
            >
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="MANAGER">Manager</MenuItem>
              <MenuItem value="USER">User</MenuItem>
            </TextField>

            <TextField
              select
              label="Status"
              size="small"
              {...methods.register("isActive")}
              error={!!methods.formState.errors.isActive}
              helperText={methods.formState.errors.isActive?.message}
              fullWidth
              defaultValue="true"
            >
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </TextField>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>

            <Button variant="contained" type="submit">
              Create User
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* </FormProvider> */}
    </Box>
  );
};

export default UserManagement;
