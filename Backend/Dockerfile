FROM python
WORKDIR /Backend
COPY ./Backend /Backend/
RUN pip install -r requirements.txt --default-timeout=2000
CMD ["python", "-m", "manage", "runserver", "9000"]