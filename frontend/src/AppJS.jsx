import { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  FormControl,
  Button,
  TextField
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import app from "./css/app.module.scss";
import { useForm, Controller } from "react-hook-form";


function App() {
  const [itemList, setItemList] = useState([]);

  const baseURL = "http://localhost:3000/";
  const get = async () => {
    const res = await fetch(baseURL);
    const items = await res.json();
    console.log(items);

    setItemList(items);
  };

  const post = async (item) => {
    console.log(JSON.stringify(item));

    fetch(baseURL + "item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    })
      .then((res) => {
        if (res.status === 200) get();
        else console.log(res);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    get()

    return () => {

    }
  }, [])

  const japanese = {
    name: '名前',
    quantity: '個数',
    unit: '単位',
  }

  const onSubmit = (data) => {
    // console.log(data)
    post(data);
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();


  return (
    <div className={app.wrapper}>
      <form className={app.itemForm} onSubmit={handleSubmit(onSubmit)}>
        {["name", "quantity", "unit"].map((elem) => (
          <FormControl
            error={!!errors[elem]}
            key={elem}
            fullWidth
          >
            <Controller
              control={control}
              name={elem}
              defaultValue=""
              rules={{
                required: !(elem === "unit"),
              }}
              render={({ field, formState: { errors } }) => (
                <TextField
                  {...field}
                  // variant="standard"
                  fullWidth
                  required={!(elem === "unit")}
                  label={japanese[elem]}
                  error={!!errors[elem]}
                  helperText={errors[elem]?.message}
                />
              )}
            />
          </FormControl>
        ))}
        <Button
          type="submit"
          variant="contained"
          sx={{
          }}
        >
          追加
        </Button>
      </form>
      <div className="item-list">
        <List>
          {itemList.map((item) => (
            <ListItem
              key={uuidv4()}
              secondaryAction={
                <IconButton edge="end" aria-label="comments">
                  <Close />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton role={undefined} dense>
                <ListItemIcon>
                  <Checkbox edge="start" />
                </ListItemIcon>
                <ListItemText
                  primary={`${item.name} ${item.quantity}${item.unit}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
}

export default App
