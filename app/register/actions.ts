"use server";

export async function handleSubmit(previousState: string, formData: FormData) {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simula una operación asincrónica de 2 segundos
    console.log(formData.get("fullname"), formData.get("email"), formData.get("password"));
    return "Registro exitoso";
}