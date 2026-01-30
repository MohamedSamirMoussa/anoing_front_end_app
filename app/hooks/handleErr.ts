export const ErrorHandler = (res:any)=>{
    if (res.meta.requestStatus === "rejected") {
        return res.payload.errMessage;
    }
    return "An unexpected error occurred.";
}