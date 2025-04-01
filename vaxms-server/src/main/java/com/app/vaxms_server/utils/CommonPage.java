package com.app.vaxms_server.utils;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.util.Iterator;
import java.util.List;
import java.util.function.Function;

@Component
public class CommonPage {
    public <T> Page<T> restPage(Page<?> page, List<T> content) {
        Page<T> p = new Page<T>() {
            @Override
            public int getTotalPages() {
                return page.getTotalPages();
            }

            @Override
            public long getTotalElements() {
                return page.getTotalElements();
            }

            @Override
            public <U> Page<U> map(Function<? super T, ? extends U> converter) {
                return null;
            }

            @Override
            public int getNumber() {
                return page.getNumber();
            }

            @Override
            public int getSize() {
                return page.getSize();
            }

            @Override
            public int getNumberOfElements() {
                return page.getNumberOfElements();
            }

            @Override
            public List<T> getContent() {
                return content;
            }

            @Override
            public boolean hasContent() {
                return page.hasContent();
            }

            @Override
            public Sort getSort() {
                return page.getSort();
            }

            @Override
            public boolean isFirst() {
                return page.isFirst();
            }

            @Override
            public boolean isLast() {
                return page.isLast();
            }

            @Override
            public boolean hasNext() {
                return page.hasNext();
            }

            @Override
            public boolean hasPrevious() {
                return page.hasPrevious();
            }

            @Override
            public Pageable nextPageable() {
                return page.nextPageable();
            }

            @Override
            public Pageable previousPageable() {
                return page.previousPageable();
            }

            @Override
            public Iterator<T> iterator() {
                return content.iterator();
            }
        };
        return p;
    }
}
