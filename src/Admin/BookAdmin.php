<?php


namespace App\Admin;

use App\Entity\Author;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Show\ShowMapper;
use Sonata\AdminBundle\Form\Type\ModelType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Validator\Constraints\File;

class BookAdmin extends AbstractAdmin
{
  protected function configureFormFields(FormMapper $form): void
  {
    $form->add('title', TextType::class);
    $form->add('cover', FileType::class, [
        'label' => 'Обложка книги',

      // unmapped means that this field is not associated to any entity property
        'mapped' => false,

      // make it optional so you don't have to re-upload the PDF file
      // every time you edit the Product details
        'required' => false,

      // unmapped fields can't define their validation using annotations
      // in the associated entity, so you can use the PHP constraint classes
        'constraints' => [
            new File([
                'maxSize' => '1024k',
                'mimeTypes' => [
                    'image',
                ],
            ])
        ],
    ]);
    $form->add('description', TextareaType::class);
    $form->add('year', TextType::class);
    $form->add('author', ModelType::class, [
        'class' => Author::class,
        'property' => 'name',
    ]);

  }

  protected function configureDatagridFilters(DatagridMapper $datagrid): void
  {
    $datagrid->add('title');
  }

  protected function configureListFields(ListMapper $list): void
  {
    $list->addIdentifier('title');
    $list->addIdentifier('description');
    $list->addIdentifier('year');
  }

  protected function configureShowFields(ShowMapper $show): void
  {
    $show->add('title');
  }
}
