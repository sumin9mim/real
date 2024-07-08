"use client";

import BaseLayout from "@/components/BaseLayout";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import db from "@/net/db";

export default function article() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    getDoc(doc(db, "articles", router.query.id)) // articles의 router.query.id에 해당하는 문서만 가지고 오겠다! --> 에러 발생(수정 필요)
      .then((doc) => {
        const data = doc.data();
        setSubject(data.subject);
        setContent(data.content);
      });
  }, []);

  return (
    <BaseLayout>
      <h1 className='p-4 mb-8 border-b'>{subject}</h1>
      <p className='p-4'>{content}</p>
    </BaseLayout>
  );
}
