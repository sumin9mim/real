"use client";

import BaseLayout from "@/components/BaseLayout";
import Link from "next/link";
import db from "@/net/db";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";

export default function Home() {
  const [list, setList] = useState([]);
  useEffect(() => {
    onSnapshot(
      query(collection(db, "articles"), orderBy("created_at", "desc")),
      (results) => {
        const newList = [];
        results.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          newList.push(data);
        });
        setList(newList);
      }
    );
    // getDocs(query(collection(db, "articles"), orderBy("created_at", "desc"))) // getDog을 통해 문서를 가져올 수 있다.
    //   .then((results) => {
    //     const newList = [];
    //     results.forEach((doc) => {
    //       const data = doc.data();
    //       data.id = doc.id;
    //       newList.push(data);
    //     });
    //     setList(newList);
    //   });
  }, []);
  return (
    <BaseLayout>
      <ul>
        <li className='flex flex-row w-full border-b p-2 mb-4'>
          <div className='flex-1 font-bold'>제목</div>
          <div className='w-64 font-bold'>작성자</div>
          <div className='w-64 font-bold'>작성일시</div>
        </li>
        {list.map((item) => (
          <li key={item.id} className='flex flex-row w-full border-b p-2 mb-4'>
            <div className='flex-1'>
              <Link href={`/articles/${item.id}`}>{item.subject}</Link>
            </div>
            <div className='w-64'>{item.author}</div>
            <div className='w-64'>
              {DateTime.fromMillis(item.created_at).toFormat(
                "yyyy-LL-dd HH:mm:ss"
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className='mb-8 w-full flex justify-end'>
        <Link href='/create'>
          <button className='border p-2 bg-black text-white'>글쓰기</button>
        </Link>
      </div>
    </BaseLayout>
  );
}
